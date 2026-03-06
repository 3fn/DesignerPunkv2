# Blast Radius Audit: Opacity Primitive Rename

**Date**: 2026-03-06
**Auditor**: Thurgood
**Scope**: Rename opacity primitives from 000–1300 naming to 000–100 value-based naming
**Scale change**: None — same 14 values, new names only

---

## Summary

| Category | Files | References | Risk | Action |
|----------|-------|------------|------|--------|
| Source code (non-test) | 14 | ~132 | 🔴 High — functional breakage if missed | Rename required |
| Component platform files | 4 | 22 | 🟡 Medium — iOS/Android/web token mappings | Rename required |
| Test files | 9 | 221 | 🔴 High — all opacity tests break | Rename required |
| Steering docs | 5 | 108 | 🟡 Medium — ballot measures required | Ballot measure + rename |
| Generated output | 1 | 22 | 🟢 Low — regenerated automatically | Regenerate |
| Public docs | 2 | 4 | 🟢 Low | Update |
| Historical specs | ~50+ | ~600+ | ⚪ None | Do not touch |
| **Active total** | **~35** | **~509** | | |

**Assessment**: Medium-large mechanical migration. Deterministic 1:1 rename (no scale changes). Achievable in 1-2 days with structured find-and-replace plus manual review for steering docs.

---

## Tier 1: Source Code (Functional — Breaks if Missed)

| File | Refs | Role |
|------|------|------|
| `src/tokens/OpacityTokens.ts` | 29 | Primitive opacity token definitions — ground zero |
| `src/tokens/ShadowOpacityTokens.ts` | 30 | Shadow-specific opacity primitives |
| `src/tokens/GlowOpacityTokens.ts` | 12 | Glow-specific opacity primitives |
| `src/tokens/semantic/OpacityTokens.ts` | 4 | Semantic opacity → primitive references |
| `src/tokens/semantic/ColorTokens.ts` | 3 | Color tokens referencing opacity primitives |
| `src/tokens/semantic/BlendTokens.ts` | 1 | Blend tokens referencing opacity |
| `src/tokens/semantic/ShadowTokens.ts` | 14 | Shadow semantics → shadow opacity primitives |
| `src/tokens/index.ts` | 16 | Token registry/exports |
| `src/composition/OpacityCompositionParser.ts` | 7 | Parses opacity token names |
| `src/composition/OpacityComposition.ts` | 3 | Opacity composition logic |
| `src/providers/WebFormatGenerator.ts` | 3 | Web output — opacity name resolution |
| `src/providers/iOSFormatGenerator.ts` | 3 | iOS output — opacity name resolution |
| `src/providers/AndroidFormatGenerator.ts` | 3 | Android output — opacity name resolution |
| `src/generators/DTCGFormatGenerator.ts` | 4 | DTCG format — opacity handling |

**Subtotal: 14 files, ~132 references**

---

## Tier 2: Component Platform Files

| File | Refs | Role |
|------|------|------|
| `src/components/core/Container-Base/platforms/ios/TokenMapping.swift` | 8 | Container iOS token mapping |
| `src/components/core/Container-Base/platforms/android/TokenMapping.kt` | 12 | Container Android token mapping |
| `src/components/core/Avatar-Base/platforms/ios/Avatar.swift` | 1 | Avatar iOS |
| `src/components/core/Avatar-Base/platforms/android/Avatar.kt` | 1 | Avatar Android |

**Subtotal: 4 files, 22 references**

---

## Tier 3: Test Files

| File | Refs | Role |
|------|------|------|
| `src/tokens/__tests__/OpacityTokens.test.ts` | 92 | Primitive opacity tests — heaviest hit |
| `src/composition/__tests__/OpacityCompositionParser.test.ts` | 47 | Composition parser tests |
| `src/__tests__/integration/OpacityPlatformTranslation.test.ts` | 21 | Integration tests |
| `src/providers/__tests__/iOSFormatGenerator-semantic.test.ts` | 16 | iOS generator tests |
| `src/tokens/semantic/__tests__/OpacityTokens.test.ts` | 14 | Semantic opacity tests |
| `src/providers/__tests__/PlatformOutputFormat.test.ts` | 13 | Platform output tests |
| `src/providers/__tests__/WebFormatGenerator-semantic.test.ts` | 10 | Web generator tests |
| `src/providers/__tests__/AndroidFormatGenerator-semantic.test.ts` | 7 | Android generator tests |
| `src/tokens/semantic/__tests__/ColorTokens.test.ts` | 1 | Color token tests |

**Subtotal: 9 files, 221 references**

---

## Tier 4: Steering Docs (Ballot Measures Required)

| File | Refs | Notes |
|------|------|-------|
| `.kiro/steering/Token-Family-Opacity.md` | 74 | Full rewrite — heaviest doc hit |
| `.kiro/steering/Token-Family-Glow.md` | 27 | Glow opacity references |
| `.kiro/steering/rosetta-system-principles.md` | 5 | Rosetta examples using opacity names |
| `.kiro/steering/Token-Family-Color.md` | 1 | Minor reference |
| `.kiro/steering/DTCG-Integration-Guide.md` | 1 | Minor reference |

**Subtotal: 5 files, 108 references, minimum 3 ballot measures**

Recommended ballot grouping:
1. Token-Family-Opacity.md (full rewrite)
2. Token-Family-Glow.md (rename references)
3. rosetta-system-principles.md + Token-Family-Color.md + DTCG-Integration-Guide.md (minor updates, can batch)

---

## Tier 5: Non-Critical Updates

| File | Refs | Notes |
|------|------|-------|
| `docs/token-system-overview.md` | 2 | Public-facing docs — update |
| `docs/releases/RELEASE-NOTES-6.0.0.md` | 2 | Historical — could leave or add migration note |
| `final-verification/DesignTokens.ios.swift` | 22 | Regenerated output — regenerate, don't hand-edit |
| `scripts/verify-opacity-types.ts` | TBD | Verification script — update |

---

## Tier 6: Do NOT Touch

Historical spec completion docs, old audit findings, and archived analysis documents. These are records of what was true at the time they were written. Renaming opacity references in these files would be rewriting history.

Examples (not exhaustive):
- `.kiro/specs/opacity-tokens/completion/*`
- `.kiro/specs/shadow-glow-token-system/completion/*`
- `.kiro/specs/blend-tokens/completion/*`
- `.kiro/specs/023-component-token-compliance-audit/findings/*`
- `.kiro/specs/024-blend-token-infrastructure-audit/findings/*`
- `.kiro/specs/010-container-component/completion/*`

---

## Migration Risk Assessment

**Risk: Missed reference** — A single missed rename creates a silent failure (token lookup returns undefined/fallback instead of the intended value). Mitigation: run full test suite after rename; any opacity test failure indicates a missed reference.

**Risk: Shadow/Glow opacity naming** — ShadowOpacityTokens and GlowOpacityTokens use the same 000–1300 naming convention. Confirm these follow the same rename pattern. If shadow/glow opacity primitives have a different naming convention, they need separate mapping.

**Risk: Generator string matching** — The format generators (Web, iOS, Android, DTCG) may use string matching or regex patterns that include the old naming format. These need manual review, not just find-and-replace.

**Risk: Composition parser** — `OpacityCompositionParser.ts` parses opacity token names. If it uses regex or string patterns that assume the old naming format (3-4 digit numbers), the parser logic needs updating, not just the token name strings.

---

## Recommended Execution Order

1. Define the complete old→new name mapping table (Ada)
2. Rename primitive definitions: `OpacityTokens.ts`, `ShadowOpacityTokens.ts`, `GlowOpacityTokens.ts`
3. Update composition layer: `OpacityCompositionParser.ts`, `OpacityComposition.ts`
4. Update semantic tokens: `OpacityTokens.ts`, `ColorTokens.ts`, `BlendTokens.ts`, `ShadowTokens.ts`
5. Update generators: `DTCGFormatGenerator.ts`, `WebFormatGenerator.ts`, `iOSFormatGenerator.ts`, `AndroidFormatGenerator.ts`
6. Update token index: `src/tokens/index.ts`, `src/tokens/semantic/index.ts`
7. Update component platform files: Container-Base, Avatar-Base
8. Update all test files (Tiers 3)
9. Run full test suite — `npm test`
10. Regenerate output: `final-verification/`
11. Update docs: `docs/token-system-overview.md`
12. Ballot measures for steering docs (Tier 4)
