# Design Document: Component Discoverability & Metadata Infrastructure

**Date**: 2026-03-28
**Spec**: 086 - Component Discoverability & Metadata Infrastructure
**Status**: Design Phase
**Dependencies**: None (Spec 081 depends on this spec)

---

## Overview

Nine interconnected improvements to component discoverability, readiness infrastructure, agent configuration, and governance processes. Implementation follows a phased ordering: immediate enrichment → readiness model → extraction pipeline → MCP split design (Spec 081).

---

## Architecture

### Data Flow (Post-Implementation)

```
Component-Family Steering Docs (source of truth)
  ├── Structured metadata blocks (purpose, contexts)
  ├── Usage Guidelines sections (when_to_use, when_not_to_use)
  └── Selection tables (alternatives)
         │
         ▼
  Extraction Script (build-time)
  ├── Validates contexts against controlled vocabulary
  ├── Derives usage from family doc sections
  ├── Warns on missing blocks or empty derivations
  └── Generates component-meta.yaml (committed to git)
         │
         ▼
  Application MCP Indexer (index-time)
  ├── Reads generated component-meta.yaml
  ├── Scans filesystem for platform artifacts
  ├── Reads schema.yaml for reviewed flags
  └── Derives per-platform readiness status
         │
         ▼
  Agent Queries (runtime)
  ├── find_components → enriched purpose + contexts
  ├── get_component_full → per-platform readiness
  └── get_prop_guidance → selection rules
```

---

## Design Decisions

### Decision 1: Benchmark Query Set

**Requirement**: Req 1 AC 3-4

Leonardo's research produced 7 benchmark queries that represent real product architect search patterns:

| Query | Expected Result | Gap Report |
|-------|----------------|------------|
| `find_components({ purpose: "filter bar" })` | Chip-Filter | #16 |
| `find_components({ purpose: "unread" })` | Badge-Count-Base, Badge-Count-Notification | #16 |
| `find_components({ purpose: "stat card" })` | Container-Card-Base | #16 |
| `find_components({ purpose: "progress" })` | Progress family | #16 |
| `find_components({ purpose: "group" })` | Container family | #16 |
| `find_components({ context: "dashboards" })` | ≥5 components | #18 |
| `find_components({ context: "settings-screens" })` | Container + Button-VerticalList + Input families | #17/#18 |

Baseline captured before any enrichment. Post-enrichment results compared against baseline.

### Decision 2: Usage Derivation Rules

**Requirement**: Req 3 AC 3

The extraction script derives `when_to_use` and `when_not_to_use` using a two-tier strategy:

1. **Per-component entries preferred**: If the family doc has a "Primitive vs Semantic Selection" table (or equivalent per-component guidance), extract entries for each component individually. Example: Badge family's selection table maps "Numeric count on navigation elements" → Badge-Count-Base, "Notification count with live region" → Badge-Count-Notification.

2. **Family-level fallback**: If no per-component guidance exists, use the family-level "When to Use This Family" section for all components in that family. Mark these as family-level in the generated meta file so the source is traceable.

`when_not_to_use` entries are derived from:
- Explicit "When NOT to Use" sections in family docs
- Inverse of selection table entries (if the table says "use X for scenario A," then Y gets a `when_not_to_use` entry for scenario A pointing to X)
- `alternatives` entries (each alternative implies a `when_not_to_use` for the scenario the alternative covers)

**Empty derivation handling**: If the script derives zero `when_to_use` entries for a component, it warns. This catches placeholder family docs ("Usage Guidelines: TBD") without silently generating hollow metadata.

### Decision 3: Controlled Vocabulary Definition

**Requirement**: Req 2

The controlled vocabulary lives in two places:
1. **Authoring reference**: A section in the Component-MCP-Document-Template (or authoring guide) listing all valid context values with consumer search terms
2. **Validation source**: An array in the extraction script that validates at generation time

Initial vocabulary derived from existing `contexts` tags across all 28 components plus Leonardo's research search terms:

| Context Value | Consumer Search Terms |
|--------------|----------------------|
| `navigation-tabs` | tab bar, bottom navigation, primary navigation |
| `dashboards` | stat cards, summary statistics, overview page, home screen metrics |
| `settings-screens` | preferences, options, configuration, account settings |
| `form-footers` | submit actions, form buttons, save/cancel |
| `content-feeds` | news feed, activity stream, scrollable list |
| `onboarding-flows` | welcome screens, setup wizard, first-run experience |
| `filter-bars` | filter chips, content filtering, search refinement |
| `list-items` | row items, cell content, list entries |
| `icon-overlays` | badge on icon, notification dot, status indicator |
| `profile-sections` | user info, account details, avatar display |
| `product-listings` | product cards, catalog items, shopping grid |
| `app-bars` | top bar, header, navigation bar |

New values added via ballot measure (family docs are steering docs). The extraction script warns on non-vocabulary values but doesn't hard-fail — allows authors to proceed while flagging the gap.

### Decision 4: Readiness Scan Implementation

**Requirement**: Reqs 4-5

**Component-level baseline gate** (checked once per component):

| Artifact | Path Pattern | Required for any platform to be `development`+ |
|----------|-------------|-----------------------------------------------|
| Schema | `{component}/{component}.schema.yaml` | Yes |
| Contracts | `{component}/contracts.yaml` | Yes |
| Types | `{component}/types.ts` | Yes |
| Tokens | `{component}/tokens.ts` or `{component}/*.tokens.ts` | No (not all components have token files) |

**Platform-specific artifacts** (checked per platform):

| Platform | Implementation File | Test Pattern |
|----------|-------------------|-------------|
| Web | `platforms/web/*.web.ts` | `**/*.test.ts` in web directory or component `__tests__/` |
| iOS | `platforms/ios/*.ios.swift` | `*Tests.swift` in iOS directory or component `__tests__/` |
| Android | `platforms/android/*.android.kt` | `*Test.kt` in Android directory or component `__tests__/` |

**Excluded from scan**: `component-meta.yaml` (generated), `dist/` output, `final-verification/` snapshots, any file in `node_modules/`.

**Status derivation logic**:
```
if schema.yaml has readiness.{platform}.status == "not-applicable":
  → not-applicable (with reason from schema)
elif no platform implementation file exists:
  → not-started
elif platform file exists but no tests:
  → scaffold
elif platform file + tests exist but reviewed == false (or absent):
  → development
elif platform file + tests exist and reviewed == true:
  → production-ready
```

**Compliance test**: Validates that for every component × platform combination, the indexer's derived status matches what the filesystem scan would produce. Runs as part of `npm test`.

### Decision 5: Knowledge Base Configuration

**Requirement**: Req 6

Per-platform agent configuration in their `.json` files:

```json
{
  "type": "knowledgeBase",
  "source": "file://./src/components/core",
  "name": "StemmaComponents{Platform}",
  "description": "Component {platform} implementations, shared types, tokens, and contracts",
  "indexType": "best",
  "includePatterns": [
    "**/platforms/{platform}/**",
    "**/types.ts",
    "**/tokens.ts",
    "**/*.tokens.ts",
    "**/contracts.yaml"
  ]
}
```

Plus platform-specific token files:

```json
{
  "type": "knowledgeBase",
  "source": "file://./src/tokens/platforms/{platform}",
  "name": "{Platform}TokenConstants",
  "description": "{Platform} token constant files",
  "indexType": "best"
}
```

**Platform Resource Map** steering doc structure:

| Resource Type | Web | iOS | Android |
|--------------|-----|-----|---------|
| Token constants (generated) | `demos/tokens.css` | `src/tokens/platforms/ios/` | `src/tokens/platforms/android/` |
| Token definitions (canonical) | `src/tokens/semantic/` | `src/tokens/semantic/` | `src/tokens/semantic/` |
| Component implementations | `src/components/core/*/platforms/web/` | `.../platforms/ios/` | `.../platforms/android/` |
| Shared types | `src/components/core/*/types.ts` | same | same |
| Shared tokens | `src/components/core/*/tokens.ts` | same | same |
| Behavioral contracts | `src/components/core/*/contracts.yaml` | same | same |

### Decision 6: Extraction Script Error Handling

**Requirement**: Req 3 ACs 5-7

| Condition | Behavior |
|-----------|----------|
| Component has schema but no metadata block in family doc | Warn: "ComponentX has no metadata block in Family-Y doc" |
| Metadata block has `purpose` under 10 words | Warn: "ComponentX purpose is under 10 words" |
| `contexts` value not in controlled vocabulary | Warn: "ComponentX uses non-vocabulary context 'foo'" |
| Derived `when_to_use` is empty (zero entries) | Warn: "ComponentX has no derived when_to_use entries — check family doc" |
| Family doc doesn't exist for a component's family | Warn: "No family doc found for ComponentX (expected Component-Family-Y.md)" |
| Extraction succeeds | Generated file committed to git; diff visible |

Warnings don't block generation — they produce output alongside warnings so the author can address them. The generated file is still committed (with whatever content was derivable) so the diff shows what's missing.

---

## Components and Interfaces

### Extraction Script

- **Location**: `src/tools/meta-extraction/` (or similar tooling directory)
- **Entry point**: `npm run extract:meta` (standalone command)
- **Input**: Component-Family steering docs (`.kiro/steering/Component-Family-*.md`)
- **Output**: `component-meta.yaml` per component in `src/components/core/{component}/`
- **Validation**: Controlled vocabulary check, minimum field lengths, empty derivation warnings

### Readiness Indexer Enhancement

- **Location**: Application MCP indexer (existing codebase)
- **Input**: Filesystem scan + `schema.yaml` readiness fields
- **Output**: Per-platform readiness in component metadata served by MCP queries

### Platform Resource Map

- **Location**: `.kiro/steering/Platform-Resource-Map.md`
- **Format**: Lookup table with platform-specific paths, naming conventions, and notes

---

## Data Models

### Structured Metadata Block (in family docs)

```markdown
### Badge-Count-Base — Metadata
- **Purpose**: Display a numeric count indicator for unread notifications or item quantities in a compact badge
- **Contexts**: navigation-tabs, list-items, icon-overlays, app-bars
```

### Schema Readiness Fields (in schema.yaml)

```yaml
readiness:
  web:
    reviewed: true
  ios:
    reviewed: false
  android:
    status: not-applicable
    reason: "Uses native Material BottomNavigation"
```

### Escape Hatch Annotation (in specs)

```markdown
### Escape Hatch: Container-Base for profile cards
- **Date**: 2026-03-28
- **Guidance says**: Use Container-Card-Base (get_prop_guidance → Container family)
- **This spec uses**: Container-Base
- **Reason**: Container-Card-Base is `development` readiness on iOS
- **Migration trigger**: Container-Card-Base reaches `production-ready` on iOS
```

---

## Error Handling

- Extraction script warnings don't block generation — they inform the author
- Readiness scan handles missing directories gracefully (missing platform dir = `not-started`)
- Controlled vocabulary validation warns, doesn't hard-fail — allows new values to be used before vocabulary is updated

---

## Testing Strategy

- **Extraction script tests**: Validate parsing of family doc formats, derivation rules, vocabulary validation, warning generation
- **Readiness compliance test**: Validate derived status matches filesystem state for all components × platforms
- **Discoverability benchmarks**: Run 7 benchmark queries before and after enrichment, compare results
- **Knowledge base validation**: Platform agents confirm improved workflow (manual verification)

---

## Correctness Properties

1. Every component with a schema has a generated `component-meta.yaml` (or a documented warning for why not)
2. Generated meta files match the content in their source family docs — no drift by construction
3. Per-platform readiness status matches actual filesystem artifact presence
4. Controlled vocabulary is the single source of valid context values
5. `reviewed` flags in schema.yaml are the only human-judgment input to readiness derivation
6. Build artifacts (generated meta files, generated token output) are excluded from readiness scans
7. Benchmark queries produce measurably better results after enrichment than before
