---
inclusion: manual
name: Figma-Workflow-Guide
description: Bidirectional Figma integration workflow — token push (054a) and design extraction (054b/054d). Covers MCP setup, CLI usage, ComponentAnalysis artifacts, troubleshooting. Load when working with Figma integration tasks.
---

# Figma Workflow Guide

**Date**: 2026-02-20
**Last Reviewed**: 2026-02-22
**Purpose**: Figma integration workflow documentation for token push and design extraction
**Organization**: process-standard
**Scope**: figma-integration
**Layer**: 2
**Relevant Tasks**: figma-integration, token-push, design-extraction

---

## Overview

DesignerPunk provides bidirectional Figma integration through two complementary workflows:

1. **Token Push** (Code → Figma): Push DesignerPunk tokens to Figma as Variables and Styles so designers work with the system's vocabulary. Implemented in Spec 054a.
2. **Design Extraction** (Figma → ComponentAnalysis): Extract Figma components into structured analysis artifacts (JSON + Markdown) that inform the spec process. Implemented in Specs 054b/054d.

Both workflows use code as the source of truth. Designers iterate in Figma using DesignerPunk tokens; extracted analyses provide structured data for human-authored design outlines and spec formalization.

### Prerequisites

- Node.js 18+
- Figma Desktop app (not the browser version — Desktop Bridge requires the desktop app)
- `figma-console-mcp` package (included as a dev dependency)
- Kiro Figma Power (installed in Kiro IDE)
- A dedicated Figma file for the token library
- A Figma Personal Access Token (PAT)
- DTCG tokens generated (`dist/DesignTokens.dtcg.json`)

---

## MCP Setup

The Figma integration uses two MCP servers strategically, plus the DesignerPunk documentation server for context queries.

### figma-console-mcp

Provides read-write access to Figma variables, styles, and Plugin API execution. Used by both push and extraction workflows.

The `figma-console-mcp` package is included as a dev dependency. It communicates with Figma Desktop via the Desktop Bridge plugin over WebSocket (ports 9223–9232).

**Key tools used:**
- `figma_get_token_values` — Read variable bindings and values
- `figma_get_styles` — Read effect and text styles
- `figma_get_component` — Read component structure
- `figma_execute` — Execute Plugin API code in Figma

### Kiro Figma Power

Provides rich read-only design context for extraction. Installed as a Kiro Power in the IDE.

**Key tools used:**
- `get_design_context` — Component structure, layout, visual properties
- `get_metadata` — File and component metadata
- `get_variable_defs` — Variable definitions
- `get_screenshot` — Visual capture of components

### Desktop Bridge Plugin Setup

The Desktop Bridge plugin enables Console MCP to execute Plugin API calls in Figma Desktop.

**Step 1: Import the plugin into Figma**

The plugin is bundled with `figma-console-mcp`:

```
node_modules/figma-console-mcp/figma-desktop-bridge/manifest.json
```

In Figma Desktop:
1. Open the menu → Plugins → Development → Import plugin from manifest…
2. Navigate to the path above and select `manifest.json`
3. The "Figma Desktop Bridge" plugin appears under Development plugins

**Step 2: Run the plugin**

1. Open your dedicated token library file in Figma Desktop
2. Go to Plugins → Development → Figma Desktop Bridge
3. The plugin starts listening for WebSocket connections on port 9223

**Step 3: Verify the connection**

```bash
# Transform only (no Figma connection needed)
npm run figma:push -- --dry-run

# Full sync (requires Desktop Bridge running)
npm run figma:push
```

### Authentication

**Personal Access Token (PAT)**

Generate a PAT at: https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens

Copy `.env.example` to `.env` and fill in:

```bash
# Figma Personal Access Token
FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN_HERE

# Figma file key (from the URL: https://figma.com/design/FILE_KEY/...)
FIGMA_FILE_KEY=your-figma-file-key
```

The file key is the alphanumeric string in your Figma file URL between `/design/` and the file name.

---

## Token Push Workflow (Spec 054a)

Pushes DesignerPunk tokens to Figma as Variables and Styles, establishing a one-way sync where code remains the source of truth.

**Pipeline:**
```
Code (Rosetta TypeScript)
  → DTCG (dist/DesignTokens.dtcg.json)
  → FigmaTransformer
  → dist/DesignTokens.figma.json
  → TokenSyncWorkflow
  → Figma Variables + Styles
```

### CLI Usage

```bash
# Normal sync — blocks if drift is detected
npm run figma:push

# Force override — sync proceeds even if Figma variables were manually edited
npm run figma:push -- --force

# Resume from a failed batch (e.g., batch 3)
npm run figma:push -- --resume 3

# Dry run — transform to dist/DesignTokens.figma.json without syncing
npm run figma:push -- --dry-run

# Force initial setup — delete and recreate all variables
npm run figma:push -- --clean
```

**Exit codes:**
- `0` — Sync completed successfully
- `1` — Sync failed (drift detected, batch error, or connection failure)

### What Gets Pushed

| Token Type | Figma Artifact | Naming Convention |
|------------|---------------|-------------------|
| Primitive variables (space, color, fontSize, etc.) | Figma Variables in "Primitives" collection | `space/100`, `color/purple/300` |
| Semantic variables (aliases) | Figma Variables in "Semantics" collection | `color/primary`, `space/inset/spacious` |
| Shadow tokens | Figma Effect Styles | `shadow.elevation200` |
| Typography tokens | Figma Text Styles | `typography.heading200` |

Variables use `/` for Figma's visual grouping hierarchy. Styles use `.` because they appear flat in Figma's style picker.

All variables are pushed to both light and dark modes with identical values (Phase 1), establishing the mode structure for future theme support.

### Drift Detection

Before pushing, the workflow compares the current Figma variable state against the expected state. If any variables have been manually edited in Figma, the sync blocks:

```
Drift detected: 3 variables have been edited in Figma since last push

Drifted variables:
  - space/300: Expected 24, found 25 (edited in Figma)
  - color/primary: Expected #B026FF, found #A020E0 (edited in Figma)

Resolution options:
  1. Revert changes in Figma, then re-run: npm run figma:push
  2. Force override (Figma changes will be lost): npm run figma:push -- --force
  3. If these values should be tokens, create them through the spec process first
```

### Partial Failure and Resume

Token sync operates in batches of 100 variables. If a batch fails (e.g., rate limit), the sync stops immediately. Completed batches remain applied:

```
✅ Created: 200 variables (batches 1-2)
❌ Failed: Batch 3 of 5
   - Error: Rate limit exceeded (429)
   - Recommendation: Wait 60 seconds, then run:
     npm run figma:push -- --resume 3
```

### Push Troubleshooting

**Desktop Bridge Not Connecting**
- Confirm Figma Desktop is running (not the browser version)
- Open the Desktop Bridge plugin: Plugins → Development → Figma Desktop Bridge
- Verify the plugin UI shows "Connected" or "Listening"
- Verify the plugin was imported from the correct manifest path

**Port Conflicts (9223–9232)**
- Check for processes using these ports: `lsof -i :9223-9232`
- Kill conflicting processes or close other MCP clients
- Restart the Desktop Bridge plugin in Figma

**Multiple MCP Server Instances**
- Close other tools that spawn Console MCP (e.g., Claude Desktop)
- Ensure only one `figma:push` process runs at a time
- Restart Figma Desktop to clear stale WebSocket connections

---

## Design Extraction Workflow (Specs 054b/054d)

Reads Figma components and generates ComponentAnalysis artifacts — structured JSON (source of truth) and human-readable Markdown — with hierarchical node trees, three-tier token classification, composition pattern detection, and screenshots.

### Design-to-Spec-to-Code Workflow

The extraction workflow is Phase 2 of a five-phase design-to-spec-to-code pipeline.

```
Phase 1: Design in Figma
├─ Designers create components using DesignerPunk tokens (pushed via 054a)
├─ Designers mark designs as "ready for spec"
└─ Design validated in Figma environment

Phase 2: Extraction — Specs 054b/054d
├─ DesignExtractor reads Figma component structure
├─ Builds hierarchical node tree with per-node token classification
├─ Detects composition patterns and resolves bound variables
├─ Captures component screenshots
├─ Generates ComponentAnalysis JSON + Markdown artifacts
└─ Human authors design-outline.md using analysis as reference

Phase 3: Spec Review — out of scope (human decision-making)
├─ Ada reviews token usage and governance decisions
├─ Lina reviews component architecture and behavioral contracts
├─ Thurgood reviews spec quality and completeness
└─ Decisions made on token governance, component structure, behavioral contracts

Phase 4: Spec Formalization — out of scope
├─ design-outline.md → requirements.md (EARS patterns)
├─ design-outline.md → design.md (architecture decisions)
└─ design-outline.md → tasks.md (implementation plan)

Phase 5: Implementation — out of scope
└─ Code written following formal spec
```

**Critical distinction**: Extraction surfaces structured data. Humans author design outlines and make governance decisions. The pipeline no longer auto-generates design-outline.md — that document is human-authored using ComponentAnalysis as reference material.

### CLI Usage

```bash
# Extract a single component
npm run figma:extract -- --file <file-key> --node <node-id>

# Extract multiple components in one run
npm run figma:extract -- --file <file-key> --node <node-id-1> --node <node-id-2>

# Specify a custom output directory
npm run figma:extract -- --file <file-key> --node <node-id> --output-dir ./my-analysis
```

**Arguments:**

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `--file <key>` | Yes | — | Figma file key (from the file URL) |
| `--node <id>` | Yes (repeatable) | — | Figma component node ID(s) |
| `--output-dir <path>` | No | `./analysis` | Output directory for analysis files |

**Exit codes:**
- `0` — Extraction completed successfully
- `1` — Extraction failed (connection error, component not found, etc.)

Unidentified token values do **not** cause failure — they are reported in the classification summary and included in the analysis artifacts for human review.

### Output Artifacts

Each extracted component produces:

| File | Purpose |
|------|---------|
| `{component-name}-analysis.json` | Structured data (source of truth) — node tree, classifications, composition patterns, unresolved bindings, recommendations |
| `{component-name}-analysis.md` | Human-readable summary — classification counts, indented node tree, token usage by node with tier indicators, recommendations with validation disclaimers |
| `images/{component-name}.png` | Component screenshot (2x scale) |

Files are written to the output directory (default: `./analysis`). The `images/` subdirectory is created automatically.

### Extraction Pipeline

When you run `figma:extract`, the following steps execute per component:

1. Load DTCG tokens from `dist/DesignTokens.dtcg.json`
2. Clean up stale ports (prevents connection issues)
3. Connect to figma-console-mcp and run pre-flight checks
4. Read component structure, token bindings, and styles in parallel
5. Resolve unknown bound variable IDs via Plugin API
6. Build hierarchical node tree with per-node token classification
7. Collect and batch-resolve bound variable IDs across all nodes
8. Reclassify unidentified values using resolved variable names
9. Detect composition patterns (repeated child instances)
10. Capture component screenshot via `figma_get_component_image`
11. Gather recommendations (variant mapping, component tokens, mode validation, platform parity)
12. Generate ComponentAnalysis JSON and Markdown artifacts

### Three-Tier Token Classification

Every token value found in the node tree is classified into one of three tiers:

| Tier | Indicator | Meaning |
|------|-----------|---------|
| Semantic Identified | ✅ | Value maps to a semantic token (e.g., `color.primary`) |
| Primitive Identified | ⚠️ | Value maps to a primitive token only (e.g., `space.300`) — may warrant a component token |
| Unidentified | ❌ | No token match found — requires human review |

The classification summary in the CLI output and Markdown report shows counts per component:

```
📊 Classification Summary:
   ButtonCTA (8 values):
     ✅ Semantic:    5
     ⚠️  Primitive:   2
     ❌ Unidentified: 1
     📸 Screenshots:  1
```

### Composition Pattern Detection

The extractor identifies repeated child component instances within the node tree:

```json
{
  "componentName": "Progress-Indicator-Node-Base",
  "instanceCount": 5,
  "propertyVariations": {
    "State": ["Complete", "Current", "Incomplete"]
  }
}
```

This helps identify dependencies between components and informs scope decisions during spec review.

### Recommendations

The Markdown report includes recommendations requiring domain specialist review, each prefixed with validation disclaimers:

- **Variant Mapping** — How Figma variants map to Stemma naming conventions (Lina reviews)
- **Component Tokens** — Repeated primitive usage that may warrant component tokens (Ada reviews)
- **Mode Validation** — Unexpected light/dark mode discrepancies (structural tokens should be mode-agnostic)
- **Platform Parity** — Web-only vs cross-platform interaction patterns (Thurgood reviews)

All recommendations include `⚠️ **Validation Required**` disclaimers — they are suggestions for human review, not automated decisions.

### Token Translation

The TokenTranslator uses a binding-first approach:

1. **Variable binding match** — Figma element uses a DesignerPunk variable → exact match by name
2. **Style name match** — Figma element uses a DesignerPunk style → exact match by style name
3. **Exact value match** — Raw value exactly matches a token value
4. **Approximate value match** — Raw value within tolerance of a token value
5. **No match** — No token found; classified as Unidentified for human review

| Category | Tolerance | Rationale |
|----------|-----------|-----------|
| Spacing | ±2px | Accounts for Figma rounding |
| Color | ΔE < 3 | Perceptually similar (CIELAB color difference) |
| Font Size | ±1px | Accounts for rendering differences |
| Radius | ±1px | Minor visual difference |

---

## Troubleshooting

### MCP Connection Issues

**Symptom:** CLI fails with connection error or timeout.

**Solutions:**
1. Verify Figma Desktop is running (not the browser version)
2. Open the Desktop Bridge plugin in Figma
3. Check for port conflicts: `lsof -i :9223-9232`
4. Kill stale processes and retry — the CLI runs port cleanup automatically, but manual cleanup may be needed
5. Ensure only one MCP client is connected at a time

### Desktop Bridge Not Running

**Symptom:** Pre-flight check fails with "Desktop Bridge not available."

**Solutions:**
1. Open Figma Desktop
2. Open your token library file
3. Go to Plugins → Development → Figma Desktop Bridge
4. Verify the plugin shows "Connected" or "Listening"
5. If the plugin doesn't appear, re-import it from `node_modules/figma-console-mcp/figma-desktop-bridge/manifest.json`

### Authentication Failures

**Symptom:** API calls fail with 401 or 403 errors.

**Solutions:**
1. Verify `FIGMA_ACCESS_TOKEN` is set in `.env`
2. Confirm the token hasn't expired — regenerate at https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens
3. Verify `FIGMA_FILE_KEY` matches the file where the Desktop Bridge is running
4. Check that the PAT has the required scopes for the operations you're performing

### Unidentified Token Values (Extraction)

**Symptom:** Classification summary shows ❌ Unidentified values.

This means the extractor found Figma values that don't correspond to any DesignerPunk token. These are included in the ComponentAnalysis artifacts for human review but do **not** cause the CLI to fail.

**Resolution:**
1. **Bind the correct variable** — If the designer intended to use a token, update the Figma design to use the correct variable binding
2. **Document as off-system value** — If the value is intentionally different, note it in the human-authored design outline
3. **Request new token** — If a new token is needed, create it through the spec process (token creation requires human approval per Token Governance)

### Missing Component-Family Docs (Extraction)

**Symptom:** Markdown analysis shows reduced recommendation quality.

**Resolution:**
The VariantAnalyzer queries Component-Family docs (e.g., `Component-Family-Button.md`) for context-aware recommendations. If the doc doesn't exist, extraction continues but variant mapping recommendations may be less accurate.

Create the Component-Family doc before re-running extraction for better recommendations. See the Component Development Guide for the doc template.

### DTCG Token File Not Found

**Symptom:** CLI fails with "DTCG token file not found."

**Solution:**
Run the DTCG generator first:
```bash
npm run build
```
This produces `dist/DesignTokens.dtcg.json` which both push and extraction workflows require.

---

## Related Documentation

- [DTCG Integration Guide](./dtcg-integration-guide.md) — DTCG format details, token type mapping, Style Dictionary and Tokens Studio integration
- [Token Governance](./../.kiro/steering/Token-Governance.md) — Token selection, usage, and creation governance; autonomy levels for different token types
- [Component Development Guide](./../.kiro/steering/Component-Development-Guide.md) — Component implementation guidance, token selection decision framework
- [Spec Planning Standards](./../.kiro/steering/Process-Spec-Planning.md) — Spec formalization process (requirements → design → tasks)
- [Token System Overview](./token-system-overview.md) — Complete Rosetta token system documentation
- [Spec 054a Design](./../.kiro/specs/054a-figma-token-push/design.md) — Token push architecture and implementation details
- [Spec 054b Design](./../.kiro/specs/054b-figma-design-extract/design.md) — Design extraction architecture (054b) and hierarchical analysis (054d)
- [Spec 054d Design](./../.kiro/specs/054d-hierarchical-design-extraction/design.md) — Hierarchical design extraction with three-tier classification
