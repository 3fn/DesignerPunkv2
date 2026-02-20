# Figma Workflow Guide

**Date**: February 20, 2026
**Purpose**: Comprehensive guide for DesignerPunk's bidirectional Figma integration — token push and design extraction workflows
**Organization**: spec-guide
**Scope**: 054a-figma-token-push, 054b-figma-design-extract
**Layer**: 3
**Relevant Tasks**: figma-integration, design-extraction, token-push

---

## Overview

DesignerPunk provides bidirectional Figma integration through two complementary workflows:

1. **Token Push** (Code → Figma): Push DesignerPunk tokens to Figma as Variables and Styles so designers work with the system's vocabulary. Implemented in Spec 054a.
2. **Design Extraction** (Figma → design-outline.md): Extract validated Figma designs into structured design outlines that enter the spec process. Implemented in Spec 054b.

Both workflows use code as the source of truth. Designers iterate in Figma using DesignerPunk tokens; validated designs are extracted and formalized through the spec process with human review at every governance decision point.

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

## Design Extraction Workflow (Spec 054b)

Reads Figma designs and generates `design-outline.md` documents with confidence flags, context-aware recommendations, and decision points for human review.

### Design-to-Spec-to-Code Workflow

The extraction workflow is Phase 2 of a five-phase design-to-spec-to-code pipeline. This spec (054b) implements Phase 2 only. Phases 3–5 follow existing DesignerPunk processes (Spec Planning Standards, Component Development Guide, Token Governance).

```
Phase 1: Design in Figma
├─ Designers create components using DesignerPunk tokens (pushed via 054a)
├─ Designers mark designs as "ready for spec"
└─ Design validated in Figma environment

Phase 2: Extraction — THIS SPEC (054b)
├─ DesignExtractor reads Figma component structure
├─ TokenTranslator matches Figma values to DesignerPunk tokens
├─ VariantAnalyzer provides context-aware recommendations
└─ design-outline.md generated with confidence flags

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

**Critical distinction: extraction surfaces information, humans make decisions.**

The extraction workflow is automated information gathering with illustrative suggestions to reduce cognitive load. It does not make governance decisions. Those require human judgment, domain expertise, and alignment with DesignerPunk principles during Phases 3–5:

- **Extraction surfaces**: Repeated primitive token usage patterns with illustrative suggestions — **Ada decides** whether to create component tokens during spec review
- **Extraction surfaces**: Variant mapping recommendations with rationale — **Lina decides** component architecture during spec review
- **Extraction surfaces**: Missing behavioral contracts — **Thurgood validates** spec completeness during spec review

### CLI Usage

```bash
# Extract a component from a Figma file
npm run figma:extract -- --file <file-key> --node <node-id>

# Specify a custom output path
npm run figma:extract -- --file <file-key> --node <node-id> --output ./my-outline.md
```

**Arguments:**

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `--file <key>` | Yes | — | Figma file key (from the file URL) |
| `--node <id>` | Yes | — | Figma component node ID |
| `--output <path>` | No | `./design-outline.md` | Output path for the generated outline |

**Exit codes:**
- `0` — Extraction completed, no human input required
- `1` — Extraction completed but human input required (no-match tokens, missing contracts), or extraction failed

### Extraction Pipeline

When you run `figma:extract`, the following steps execute:

1. Load DTCG tokens from `dist/DesignTokens.dtcg.json`
2. Clean up stale ports (prevents connection issues)
3. Connect to figma-console-mcp
4. Read component structure via Kiro Figma Power
5. Read token bindings via figma-console-mcp
6. Read styles via figma-console-mcp
7. Query Component-Family docs for context
8. Translate all values using TokenTranslator (binding-first, value fallback)
9. Reconstruct composite tokens (shadows, typography)
10. Detect behavioral contracts (interactive vs static)
11. Detect platform parity (web-only vs cross-platform states)
12. Surface component token decision points
13. Validate mode consistency (light/dark)
14. Generate `design-outline.md` with confidence flags

### Confidence Flag Interpretation

Every section in the generated design outline includes confidence flags indicating how reliably the extraction matched Figma values to DesignerPunk tokens. Flags appear at two levels: per-token (individual matches) and overall (the entire extraction).

#### Per-Token Flags

Each token reference in the Token Usage tables carries a flag:

| Flag | Meaning | When It Appears | Action Required |
|------|---------|-----------------|-----------------|
| ✅ High Confidence | Exact match via variable binding or style name | Element uses a DesignerPunk variable or style directly | None — value is confirmed |
| ⚠️ Needs Review | Approximate value match or ambiguous result | Value is within tolerance but no direct binding exists; or recommendations conflict | Review the match and confirm or correct |
| ❌ Requires Human Input | No match found or critical information missing | No token matches the value; behavioral contracts missing for interactive component | Must resolve before proceeding to spec formalization |

#### Overall Extraction Confidence

The Extraction Confidence section at the bottom of the design outline aggregates all per-token flags into an overall assessment:

| Overall Flag | Condition |
|-------------|-----------|
| ✅ High | All matches are exact, no approximate or no-match values, and no review items |
| ⚠️ Medium | No unmatched values and no blocking review items, but some approximate matches exist |
| ❌ Low | One or more no-match values, missing behavioral contracts, unexpected mode discrepancies, or conflicting variant recommendations |

When overall confidence is ❌ Low, the CLI exits with code 1 and the Extraction Confidence section lists specific review items that must be resolved before proceeding to spec formalization.

#### When Each Flag Appears — Examples

**✅ High Confidence examples:**

- A button's padding uses the Figma variable `space/300` → TokenTranslator resolves it to `space.300` via binding match. The Token Usage table shows:

  ```
  | padding-inline | `space.300` | ✅ exact | binding |
  ```

- A shadow style named `shadow.elevation200` matches the DTCG composite token `shadow.elevation200` by name. The Shadows table shows:

  ```
  | box-shadow | `shadow.elevation200` | ✅ exact | binding |
  ```

- A text element uses the Figma variable `color/purple/300` → TokenTranslator resolves it to `color.purple.300` and enriches with the semantic alias `color.primary`:

  ```
  | background | `color.primary` (primitive: `color.purple.300`) | ✅ exact | binding |
  ```

**⚠️ Needs Review examples:**

- A designer manually typed `25px` for padding instead of binding the `space/300` variable (24px). The value falls within the ±2px spacing tolerance, so TokenTranslator returns an approximate match:

  ```
  | padding-block | `space.300` | ⚠️ approximate (delta: +1px) | value |
  ```

  Action: Confirm the designer intended `space.300` and update the Figma design to use the variable binding.

- A color value `#B12AF0` has no variable binding but is perceptually close to `color.purple.300` (`#B026FF`) with ΔE < 3:

  ```
  | border-color | `color.purple.300` | ⚠️ approximate (ΔE: 2.1) | value |
  ```

  Action: Verify the designer intended this token. If so, bind the variable in Figma. If the color is intentionally different, document it as an off-system value.

- The VariantAnalyzer's family pattern recommendation conflicts with its behavioral analysis. The Inheritance Pattern section shows ⚠️ with both recommendations and a "Human Decision Required" label.

- The Component-Family doc is missing. The Inheritance Pattern section shows ⚠️ and recommends creating the doc before proceeding.

**❌ Requires Human Input examples:**

- A designer used `30px` for padding, which exceeds the ±2px tolerance for any spacing token. No match is found:

  ```
  | margin-block | — | ❌ no-match (closest: space.300, delta: +6px) | value |
  ```

  Action: Choose one of three options — map to the suggested token, document as an off-system value, or request a new token through the spec process.

- An interactive component (button) has no behavioral contracts defined. The Behavioral Contracts section shows ❌ and blocks progression to requirements.md.

- A spacing token has different values in light mode (24px) and dark mode (32px). The Mode Validation section flags this as an unexpected discrepancy because structural tokens should be mode-agnostic.

#### Tolerance Rules for Approximate Matches

When no variable binding exists, the TokenTranslator falls back to value-based matching with these tolerances:

| Category | Tolerance | Rationale |
|----------|-----------|-----------|
| Spacing | ±2px | Accounts for Figma rounding |
| Color | ΔE < 3 | Perceptually similar (CIELAB color difference) |
| Font Size | ±1px | Accounts for rendering differences |
| Radius | ±1px | Minor visual difference |

Values within tolerance produce ⚠️ approximate matches. Values outside tolerance produce ❌ no-match results. Binding matches always produce ✅ exact results regardless of the underlying value.

#### Reading the Extraction Confidence Summary

The Extraction Confidence section at the bottom of every design outline looks like this:

```markdown
## Extraction Confidence

**Overall**: ⚠️ medium

| Metric | Count |
|--------|-------|
| ✅ Exact matches | 12 |
| ⚠️ Approximate matches | 3 |
| ❌ No matches | 0 |
```

When human input is required, a callout appears below the table listing each item that needs attention:

```markdown
> **⚠️ Human Input Required** — Review the items below before proceeding to spec formalization.

- 2 token value(s) could not be matched — requires human decision
- Missing behavioral contracts for interactive component — define before proceeding to requirements.md
```

Resolve all listed items before moving the design outline into the spec process (Phase 3).

### Token Translation

The TokenTranslator uses a binding-first approach:

1. **Variable binding match** — Figma element uses a DesignerPunk variable → exact match by name (e.g., `space/300` → `space.300`)
2. **Style name match** — Figma element uses a DesignerPunk style → exact match by style name
3. **Exact value match** — Raw value exactly matches a token value
4. **Approximate value match** — Raw value within tolerance of a token value
5. **No match** — No token found; extraction pauses for human decision

The `matchMethod` field in results indicates whether the match was found via `binding` (name-based) or `value` (value-based).

### Design Outline Sections

The generated `design-outline.md` includes these sections:

- **Component Purpose** — Name, description, and classification
- **Variants** — Figma variant definitions and properties
- **States** — Visual states (hover, focus, disabled, pressed)
- **Token Usage** — Spacing, colors, typography, radius, shadows with confidence flags
- **Accessibility** — Accessibility considerations extracted from the design
- **Platform Behaviors** — Platform-specific interaction patterns
- **Edge Cases** — Detected edge cases and boundary conditions
- **Extraction Confidence** — Overall confidence summary with match counts
- **Inheritance Pattern** — Component-Family alignment and recommendations
- **Behavioral Contracts** — Interactive vs static classification; missing contracts flagged
- **Platform Parity** — Web-only vs cross-platform state detection
- **Component Token Needs** — Repeated primitive usage patterns with illustrative suggestions (pending Ada review)
- **Accessibility Contracts** — Accessibility requirements for the component

### Annotated Example

A complete annotated example design-outline.md is available at [`docs/examples/design-outline-example.md`](./examples/design-outline-example.md). It shows every section the extractor generates for a `ButtonCTA` component, with HTML comment annotations explaining each section's purpose, how to interpret confidence flags in context, illustrative component token suggestions, and mode validation categorization. Use it as a companion when reviewing real extraction results.

### Component Token Suggestions

When the extractor detects repeated primitive token usage across component properties, it surfaces illustrative suggestions to reduce cognitive load during spec review:

```markdown
## Component Token Needs

### Pattern 1: Repeated Padding Usage

**Primitive Token**: `space.300` (24px)

**Usage Context**:
- Button padding-left: 5 variants
- Button padding-right: 5 variants

**Illustrative Suggestion** (pending Ada review):
  button.padding.horizontal = space.300

**Rationale**: Consistent spacing across button variants suggests semantic intent.

**Ada Decision Required**: Evaluate whether component tokens align with
Token Governance standards and button component architecture.
```

These suggestions are illustrative only. Ada makes final token governance decisions during spec review.

### Mode Validation

The extractor checks light/dark mode consistency for each token binding:

- **Expected differences** (no flag): Color tokens differ by mode (light/dark theme variations)
- **Unexpected differences** (flagged for review): Spacing, radius, or typography tokens differ by mode — structural tokens should be mode-agnostic

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

### No-Match Token Values (Extraction)

**Symptom:** Extraction exits with code 1 and reports unmatched values.

This means the extractor found Figma values that don't correspond to any DesignerPunk token. The CLI output shows each unmatched value with options:

```
❌ Unmatched values requiring human decision:
   • padding-left: 30px — closest: space.300 (delta: +6px)
     → Map to suggested token (space.300)
     → Document as off-system value
     → Request new token creation through spec process
```

**Resolution:**
1. **Map to suggested token** — If the value is close enough and the designer intended to use that token, update the Figma design to use the correct variable binding
2. **Document as off-system value** — If the value is intentionally different, note it in the design outline for spec review
3. **Request new token** — If a new token is needed, create it through the spec process (token creation requires human approval per Token Governance)

### Missing Component-Family Docs (Extraction)

**Symptom:** Design outline shows ⚠️ on variant recommendations with a note about missing Component-Family doc.

**Resolution:**
The VariantAnalyzer queries Component-Family docs (e.g., `Component-Family-Button.md`) for context-aware recommendations. If the doc doesn't exist, extraction continues with reduced confidence.

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
- [Spec 054b Design](./../.kiro/specs/054b-figma-design-extract/design.md) — Design extraction architecture and implementation details
