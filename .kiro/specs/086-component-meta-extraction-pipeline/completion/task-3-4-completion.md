# Task 3.4 Completion: Build Extraction Script

**Date**: 2026-03-28
**Task**: 3.4 Build extraction script
**Type**: Architecture
**Status**: Complete

---

## Artifacts Created

- `scripts/extract-component-meta.ts` — Extraction script
- `package.json` — Added `extract:meta` npm script entry

## Implementation Details

### Approach

TypeScript script following project convention (`scripts/` directory, `ts-node` runner). Reads Component-Family steering docs and generates `component-meta.yaml` per component.

### Pipeline

1. **Discover** all components from `src/components/core/*/component-meta.yaml`
2. **Parse** all `Component-Family-*.md` files for `### [Name] — Metadata` blocks (purpose, contexts)
3. **Derive usage** from selection tables (per-component) or Usage Guidelines sections (family-level fallback)
4. **Guidance YAML fallback**: If family doc yields empty usage, reads `family-guidance/*.yaml` for `whenToUse`/`whenNotToUse`
5. **Derive alternatives** from selection table entries pointing to sibling components
6. **Validate**: contexts against controlled vocabulary, purpose word count, alternative references against catalog
7. **Generate** YAML with family-level derivation comment when applicable

### Derivation Tiers (from Task 3.2 audit)

| Tier | Families | Components | Derivation Source |
|------|----------|-----------|-------------------|
| Per-component (selection table) | Badge, Chip, Container, FormInput, Icon | 18 | Selection table Scenario→Component rows |
| Family-level (steering doc) | Button, Navigation, Progress | 12 | Usage Guidelines "When to Use" bullets |
| Guidance YAML fallback | Avatar | 1 | `family-guidance/avatars.yaml` whenToUse/whenNotToUse |

### Key Decisions

- **Comment marking**: Family-level derived usage gets `# Derived from family-level guidance (filename)` comment for traceability
- **Guidance YAML fallback**: Added for families where steering doc Usage Guidelines section has code examples instead of bullet lists (Avatar). Reads from `family-guidance/*.yaml` as third-tier fallback.
- **Warn, don't block**: All validation issues produce warnings alongside generated output. Files are still written so diffs show what's missing.

### Error Handling (per design Decision 6)

| Condition | Behavior | Status |
|-----------|----------|--------|
| No metadata block in family doc | Warn | ✅ Implemented |
| Purpose under 10 words | Warn | ✅ Implemented |
| Non-vocabulary context | Warn | ✅ Implemented |
| Empty when_to_use derivation | Warn | ✅ Implemented |
| Phantom alternative reference | Warn | ✅ Implemented |

## Validation (Tier 3: Comprehensive)

### Functional Validation

- ✅ `npm run extract:meta` generates 30 component-meta.yaml files
- ✅ Zero warnings on current family docs
- ✅ All 3 derivation tiers produce valid output
- ✅ Family-level comment marking works correctly

### Integration Validation

- ✅ Application MCP builds clean after extraction
- ✅ Application MCP health: healthy, zero warnings
- ✅ CoverageDrift and GuidanceCompleteness tests pass

### Requirements Compliance

- ✅ Req 2.4: Validates contexts against controlled vocabulary
- ✅ Req 3.3: Derives usage from family doc sections (two-tier + guidance fallback)
- ✅ Req 3.4: Generates component-meta.yaml that passes MCP health check
- ✅ Req 3.5: Generated files committed to git with visible diffs
- ✅ Req 3.6: Diffs visible at commit time
- ✅ Req 3.7: Warns on missing metadata blocks (doesn't silently skip)
