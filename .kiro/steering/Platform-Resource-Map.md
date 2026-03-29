---
inclusion: manual
name: Platform-Resource-Map
description: Platform-specific file paths for component implementations, tokens, and shared artifacts. Load when navigating component source, verifying platform parity, or auditing test coverage.
---

# Platform Resource Map

**Date**: 2026-03-28
**Last Updated**: 2026-03-28
**Purpose**: Cross-platform file path reference for component source, tokens, and shared artifacts
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: platform-implementation, cross-platform-parity, test-coverage-audit

**Maintenance**: Update when new components are added or directory structure changes.

---

## Component Source

| Resource | Web | iOS | Android |
|----------|-----|-----|---------|
| Implementation | `src/components/core/{Component}/platforms/web/*.web.ts` | `...platforms/ios/*.ios.swift` | `...platforms/android/*.android.kt` |
| Tests (platform dir) | — | `...platforms/ios/*Tests.swift` | `...platforms/android/*Test.kt` |
| Tests (shared dir) | `src/components/core/{Component}/__tests__/*.test.ts` | — | — |
| Shared types | `src/components/core/{Component}/types.ts` | same | same |
| Shared tokens | `src/components/core/{Component}/tokens.ts` or `*.tokens.ts` | same | same |
| Behavioral contracts | `src/components/core/{Component}/contracts.yaml` | same | same |
| Schema | `src/components/core/{Component}/{Component}.schema.yaml` | same | same |
| Component metadata | `src/components/core/{Component}/component-meta.yaml` | same | same |

## Token System

| Resource | Web | iOS | Android |
|----------|-----|-----|---------|
| Token definitions (canonical) | `src/tokens/semantic/` | same | same |
| Platform token constants | `dist/DesignTokens.web.css` (generated) | `src/tokens/platforms/ios/*.swift` | `src/tokens/platforms/android/*.kt` |
| Primitive tokens | `src/tokens/primitives/` | same | same |
| Theme overrides | `src/tokens/themes/` | same | same |

## Family Guidance

| Resource | Path |
|----------|------|
| Family steering docs | `.kiro/steering/Component-Family-{Family}.md` |
| Family guidance YAML | `family-guidance/{family}.yaml` |
| Document template | `.kiro/steering/Component-MCP-Document-Template.md` |

## Notes

- `src/tokens/semantic/` is the canonical reference for token names across all platforms. When verifying token name correctness, check here first.
- Web tests live in the component-level `__tests__/` directory (`.test.ts`). iOS and Android tests live in their respective platform directories.
- `component-meta.yaml` is a generated artifact (via `npm run extract:meta`). Purpose and contexts are extracted from family docs; usage and alternatives may be hand-authored.
- `dist/` contains build artifacts — not source files. Do not reference for implementation work.
