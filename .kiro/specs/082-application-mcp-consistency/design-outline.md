# Application MCP Consistency & Governance

**Date**: 2026-03-20
**Updated**: 2026-03-21
**Purpose**: Normalize naming conventions across the Application MCP ecosystem — family names, MCP identity, directory naming — and establish governance infrastructure to prevent future drift
**Organization**: spec-guide
**Scope**: 082-application-mcp-consistency
**Status**: Design outline — pending Lina/Ada review

---

## Problem Statement

The Application MCP ecosystem has accumulated naming inconsistencies across three dimensions:

### 1. Family Name Inconsistency

Component family names are inconsistent across schemas, guidance YAMLs, and steering docs — and schemas are inconsistent *with themselves*:

| Family | Schema (`family:`) | Guidance (`family:`) | Steering Doc |
|--------|-------------------|---------------------|--------------|
| Avatar | `Avatar` | `"Avatars"` | `Avatar` |
| Badge | `Badge` | `"Badges"` | `Badge` |
| Button | `Button` / `Buttons` ⚠️ | `"Buttons"` | `Button` |
| Chip | `Chip` | `"Chips"` | `Chip` |
| Container | `Containers` | `"Containers"` | `Container` |
| Form Inputs | `FormInputs` | `"Form Inputs"` | `Form-Inputs` |
| Icon | `Icons` | `"Icons"` | `Icon` |
| Navigation | `Navigation` | — (no guidance yet) | `Navigation` |
| Progress | `Progress-Indicator` | `"Progress Indicators"` | `Progress` |

The Button family is split: `Button-CTA` says `Buttons`, while `Button-Icon`, `Button-VerticalList-Item`, and `Button-VerticalList-Set` say `Button`.

Three distinct conventions coexist with no canonical source:
- **Schemas**: Mixed singular/plural, mixed formats (`FormInputs`, `Progress-Indicator`, `Containers`)
- **Guidance YAMLs**: Consistently plural with spaces (`"Buttons"`, `"Form Inputs"`)
- **Steering docs**: Consistently singular, kebab-case filenames (`Component-Family-Button.md`)

Surfaced by Spec 075's coverage drift test, which had to work around the mismatch by checking component-level reachability instead of direct family name lookup.

### 2. MCP Identity Inconsistency

The Application MCP has four different names across the codebase:

| Context | Name Used |
|---------|-----------|
| Directory | `component-mcp-server/` |
| Package name | `@designerpunk/mcp-component-server` |
| Docs (sometimes) | "Component MCP" |
| Docs (sometimes) | "Application MCP" |
| MCP Relationship Model | "Application MCP" |

Five new product agents (Leonardo, Kenya, Data, Sparky, Stacy) will navigate this codebase. An agent seeing `component-mcp-server/` will reasonably conclude that's the "Component MCP," then encounter the MCP Relationship Model calling it "Application MCP" and have to reconcile the mismatch — exactly the kind of inconsistency this spec exists to eliminate.

### 3. No Enforcement Infrastructure

No validation exists to prevent family name drift. A developer creating a new component can use any string for `family:` — singular, plural, hyphenated, spaced — and nothing catches it until an agent hits a query mismatch.

---

## Impact

- **Coverage drift test**: Uses an indirect workaround instead of clean family name comparison
- **MCP queries**: `getGuidance("Button")` returns null because guidance uses `"Buttons"`. Only component-name lookups work reliably.
- **Agent confusion**: An agent reading a schema sees `family: FormInputs`, but querying guidance needs `"Form Inputs"`. No mapping exists.
- **New agent onboarding**: Five product agents will encounter conflicting names for the same MCP server
- **Future growth**: Every new family and every new MCP reference compounds the inconsistency

---

## Resolved Decisions

### D1: Canonical Family Naming Convention — Singular PascalCase

**Decision**: Singular PascalCase with no spaces or hyphens.

| Family | Canonical Name | Display Name |
|--------|---------------|--------------|
| Avatar | `Avatar` | "Avatars" |
| Badge | `Badge` | "Badges" |
| Button | `Button` | "Buttons" |
| Chip | `Chip` | "Chips" |
| Container | `Container` | "Containers" |
| Form Inputs | `FormInput` | "Form Inputs" |
| Icon | `Icon` | "Icons" |
| Navigation | `Navigation` | "Navigation" |
| Progress | `ProgressIndicator` | "Progress Indicators" |

**Rationale**:
- **AI-optimal**: Single token, no quoting, no spaces. `FormInput` is unambiguous in YAML, JSON, TypeScript, and markdown.
- **Predictable**: Every family name follows the same pattern. An agent learning the convention from one family can predict all others.
- **Greppable**: No false matches from spaces or pluralization ambiguity.
- **Derivable**: Closer to component name prefixes (`Button-CTA` → `Button`, `Progress-Indicator-Node-Base` → `ProgressIndicator`).

**Display name**: Guidance YAMLs gain a `displayName` field for human-facing contexts. The canonical `family:` is the machine identifier; `displayName:` is what appears in human-readable MCP responses and documentation.

**`displayName` interface change**: This is a three-layer change:
1. **Model**: Add `displayName: string` to `FamilyGuidance` interface (`models/index.ts`)
2. **Parser**: Read `displayName` from YAML in `FamilyGuidanceIndexer.parseGuidanceFile()`
3. **Response**: Expose `displayName` in `PropGuidanceResponse` so MCP consumers receive both the canonical name and the display name

`getGuidance()` returns both `family` (canonical) and `displayName` (human-facing). Consumers use `family` for programmatic matching and `displayName` for rendering.

### D2: Migration Strategy — Big Bang

**Decision**: Update all files in a single coordinated change.

**Rationale**: This is a data-only change (family names) plus a directory rename. Incremental migration would create a period where some families use old names and some use new, which is worse than the current state. Big bang with comprehensive test validation is the safe path.

### D3: MCP Identity — "Application MCP"

**Decision**: Standardize on "Application MCP" everywhere.

- Directory: `component-mcp-server/` → `application-mcp-server/`
- Package: `@designerpunk/mcp-component-server` → `@designerpunk/application-mcp-server`
- All active steering docs, agent prompts, and README: "Application MCP"
- Historical completion docs (specs 064, 067, 068): Keep original names — they document the state at the time

**Rationale**: "Application" describes the MCP's role (applying the design system to build things). "Component" describes one of its content types. The MCP Relationship Model already defines the three-MCP taxonomy as Docs / Application / Product. The directory and package name should match.

### D4: Enforcement Mechanism — Schema Validation Test

**Decision**: Add a test that validates schema `family:` values against the canonical family name set.

The canonical set is derived from guidance YAMLs plus an explicit allowlist for families without guidance yet (e.g., Navigation). Any schema with a `family:` value not in the canonical set fails the test with a clear message.

**Rationale**: Documentation alone doesn't prevent drift. The CoverageDrift pattern from Spec 075 proved that test-time enforcement catches problems at the point of introduction.

### D5: Canonical Family Registry — Single Source of Truth

**Decision**: Create a canonical family registry as a first-class artifact that serves as the single authoritative source for family identity.

The registry maps every family's canonical name, display name, and component prefix:

```yaml
# family-registry.yaml (location TBD — likely alongside family-guidance/)
families:
  - canonical: Avatar
    displayName: "Avatars"
    prefix: "Avatar-"
  - canonical: Badge
    displayName: "Badges"
    prefix: "Badge-"
  - canonical: Button
    displayName: "Buttons"
    prefix: "Button-"
  - canonical: Chip
    displayName: "Chips"
    prefix: "Chip-"
  - canonical: Container
    displayName: "Containers"
    prefix: "Container-"
  - canonical: FormInput
    displayName: "Form Inputs"
    prefix: "Input-"
  - canonical: Icon
    displayName: "Icons"
    prefix: "Icon-"
  - canonical: Navigation
    displayName: "Navigation"
    prefix: "Nav-"
  - canonical: ProgressIndicator
    displayName: "Progress Indicators"
    prefix: "Progress-"
```

**Rationale**:
- **Single source of truth**: Family identity (canonical name, display name, prefix) lives in one place, not scattered across guidance YAMLs, test files, and documentation.
- **AI-optimal**: An agent can load one file to understand the complete family namespace — no cross-referencing needed.
- **Dual consumer**: The `FamilyNameValidation.test.ts` reads this registry to enforce schema `family:` values. The `FamilyGuidanceIndexer` can use it as a fallback `displayName` for families without guidance YAMLs.
- **Extensible**: New families register here first. The validation test catches any schema that references an unregistered family.
- **Decouples display name from guidance**: Families without guidance (e.g., Navigation) still have a display name. The guidance YAML's `displayName` field becomes optional — if present, it must match the registry; if absent, the registry provides the fallback.

---

### In Scope

**Canonical Family Registry**
- Create `family-registry.yaml` as the single source of truth for family identity
- Contains canonical name, display name, and component prefix for every family
- Consumed by validation tests, indexers, and documentation

**Family Name Normalization**
- Normalize `family:` field in all 30 schema.yaml files to singular PascalCase
- Normalize `family:` field in all 8 guidance YAMLs to singular PascalCase
- Add `displayName` field to guidance YAMLs (must match registry; optional if registry provides fallback)
- Update FamilyGuidanceIndexer to expose `displayName` in query responses (fallback to registry for families without guidance)
- Update CoverageDrift.test.ts to use direct family name lookup (remove workaround)

**MCP Identity Rename**
- Rename directory: `component-mcp-server/` → `application-mcp-server/`
- Update package name: `@designerpunk/application-mcp-server`
- Update `.kiro/settings/mcp.json` path reference
- Update `.kiro/agents/lina.json` glob pattern
- Update all 8 agent prompt files and JSON configs where they reference the MCP by name
- Update active steering docs that reference "Component MCP" or `component-mcp-server`
- Update README

**Governance Infrastructure**
- Add `FamilyNameValidation.test.ts` — reads `family-registry.yaml` to validate schema `family:` values (separate from CoverageDrift — distinct concern: data integrity vs coverage)
- New family registration: test fails with clear message when unknown family name appears ("New family 'X' detected — register in family-registry.yaml")
- Add "Family Naming Convention" section to Component Development Guide:
  - Points to `family-registry.yaml` as the authoritative source
  - Forward-looking rule for new families (must use canonical name as prefix)
  - Explicit note that legacy families have a documented prefix mapping (two-tier system acknowledgment)
  - Note that guidance YAML filenames are independent of canonical family names
- Update steering docs that contain schema examples with old family names (teaching material — see Hard References)

### Out of Scope
- Steering doc filenames (`Component-Family-Button.md`) — human-facing, keep current convention
- Component names (`Button-CTA`, `Input-Text-Base`) — already consistent
- Guidance YAML filenames (`button.yaml`, `form-inputs.yaml`) — filesystem identifiers, not family names
- Historical completion docs (specs 064, 067, 068) — records of what happened, keep original names
- Indexer architecture changes — resolution logic stays the same, only data values change

---

## Blast Radius

### Hard References (functional — must change for correctness)

**Data files (family name normalization):**
| Files | Change |
|-------|--------|
| 30 schema.yaml files | `family:` field → canonical PascalCase |
| 8 guidance YAMLs | `family:` field → canonical PascalCase + add `displayName` |

Note: `Button-CTA` currently uses `family: Buttons` while other Button components use `family: Button`. This is not a simple find-and-replace — each schema needs manual verification against the canonical name table.

**Config files (directory rename):**
| File | Change |
|------|--------|
| Directory | `component-mcp-server/` → `application-mcp-server/` |
| `application-mcp-server/package.json` | name → `@designerpunk/application-mcp-server` + description |
| `.kiro/settings/mcp.json` | 1 path to `dist/index.js` |
| `.kiro/agents/lina.json` | 1 glob pattern |

No references in `tsconfig*`, root `jest.config.js`, or root `package.json`. Internal imports use relative paths — unaffected by directory rename.

**Code files (interface + parser):**
| File | Change |
|------|--------|
| `models/index.ts` | Add `displayName` to `FamilyGuidance` interface |
| `FamilyGuidanceIndexer.ts` | Parse `displayName` from YAML |
| `QueryEngine.ts` / response models | Expose `displayName` in `PropGuidanceResponse` |
| `FamilyGuidanceIndexer.test.ts` | Update `getGuidance('Buttons')` → `getGuidance('Button')` |
| `CoverageDrift.test.ts` | Replace indirect workaround with direct family name lookup |

**New test file:**
| File | Purpose |
|------|---------|
| `FamilyNameValidation.test.ts` | Validates schema `family:` values against registry |

**New artifact:**
| File | Purpose |
|------|---------|
| `family-registry.yaml` | Single source of truth for family identity (canonical name, display name, prefix) |

### Hard References (teaching material — must update to avoid teaching wrong conventions)
| File | References |
|------|-----------|
| `Component-Schema-Format.md` | Schema examples with `family: FormInputs` |
| `Component-Readiness-Status.md` | Family name references (7 matches) |
| `Component-Development-Standards.md` | Family labels + "Component MCP" references |
| `Process-Spec-Planning.md` | Family name in examples |

### Soft References (documentation — update for naming consistency)

**Steering docs (MCP identity — "Component MCP" → "Application MCP"):**
| File | Matches |
|------|---------|
| `Component-Templates.md` | 2 |
| `Component-Family-Navigation.md` | 1 |
| `Component-Family-Icon.md` | 1 |
| `Component-Family-Form-Inputs.md` | 1 |
| `Component-Family-Container.md` | 1 |
| `Component-Family-Button.md` | 1 |
| `Component-Family-Progress.md` | 1 |
| `Component-Meta-Data-Shapes-Governance.md` | 1 |
| `Component-Quick-Reference.md` | 1 |
| `00-Steering Documentation Directional Priorities.md` | 1 |

**Steering docs (family name references — old conventions in prose):**
| File | Matches |
|------|---------|
| `Component-Family-Progress.md` | 12 (`Progress-Indicator`) |
| `Figma-Workflow-Guide.md` | 6 (`FormInputs`) |
| `stemma-system-principles.md` | 4 |
| `Contract-System-Reference.md` | 2 |

**Agent prompt files (MCP identity):**
| File | Matches |
|------|---------|
| `leonardo-prompt.md` | 8 |
| `lina-prompt.md` | 5 |
| `ada-prompt.md` | 3 |
| `sparky-prompt.md` | 2 |
| `data-prompt.md` | 2 |
| `kenya-prompt.md` | 2 |
| `stacy-prompt.md` | 2 |

**Docs directory:**
| File | Matches |
|------|---------|
| `README.md` | 6 |
| `docs/component-mcp-query-guide.md` | 3 |
| `docs/component-metadata-schema-reference.md` | 2 |
| `docs/component-meta-authoring-guide.md` | 2 |

**Release notes (historical — keep original names):**
| File | Rationale |
|------|-----------|
| `docs/releases/RELEASE-NOTES-9.3.0.md` | Historical record |
| `docs/releases/RELEASE-NOTES-9.0.0.md` | Historical record |

### Unchanged
| Category | Rationale |
|----------|-----------|
| Historical completion docs (specs 064, 067, 068) | Records of state at time of completion |
| Historical release notes | Records of state at time of release |
| Root `jest.config.js` | No reference to component-mcp-server |
| Root `package.json` | No reference to component-mcp-server |
| `tsconfig*` | No reference to component-mcp-server |
| Internal imports | All use relative paths |

---

## Dependencies

| Spec | Relationship |
|------|-------------|
| 075 | CoverageDrift test — will be simplified after normalization |
| 068 | FamilyGuidanceIndexer — `displayName` field addition, Map key change |
| 067 | Application MCP — family names are stable identifiers per MCP Relationship Model |
| 070 | Agent Architecture — agent configs reference MCP by name and path |
| 069 | Layout Templates (future) — should use canonical names from day one |

---

## Reevaluation Triggers

- If the Application MCP adds family-level queries beyond `getGuidance()`, the canonical name becomes even more critical
- If Spec 069 (Layout Templates) introduces family-scoped layout guidance, it should use canonical names from this spec
- If new families are added before this spec ships, they should follow the canonical convention proactively

---

## Component Name Prefix Mapping

Component names use `[Family]-[Type]-[Variant]` but three families have prefixes that don't match their canonical family name. These are documented here as the authoritative mapping — not changed, because component names are stable identifiers with deep references across the codebase.

| Canonical Family | Component Prefix | Notes |
|-----------------|-----------------|-------|
| `Avatar` | `Avatar-` | Clean match |
| `Badge` | `Badge-` | Clean match |
| `Button` | `Button-` | Clean match |
| `Chip` | `Chip-` | Clean match |
| `Container` | `Container-` | Clean match |
| `FormInput` | `Input-` | ⚠️ Prefix omits `Form` |
| `Icon` | `Icon-` | Clean match |
| `Navigation` | `Nav-` | ⚠️ Abbreviated prefix |
| `ProgressIndicator` | `Progress-` / `Progress-Indicator-` | ⚠️ Two prefixes — primitives use `Progress-Indicator-`, semantic variants use `Progress-` |

**Forward-looking rule**: New families MUST use the canonical family name as the component prefix. No abbreviations, no divergence. This will be added to the Component Development Guide as part of this spec.

**Existing names are not renamed.** The cost of renaming 30 components across directories, imports, schemas, contracts, meta files, tests, platform implementations, experience patterns, guidance selectionRules, and documentation far exceeds the benefit. The mapping above makes the relationship explicit and learnable.

---

## Open Questions for Reviewers

- **[@LINA]**: Does the `displayName` addition to guidance YAMLs require changes to the `FamilyGuidance` interface or just the parser? Any concerns about the Map key change from plural display names to singular PascalCase?
- **[@ADA]**: Any token documentation that references family names by the old conventions? Steering docs in your domain that need updating?
