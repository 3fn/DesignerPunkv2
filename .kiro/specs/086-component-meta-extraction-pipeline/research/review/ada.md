# Synthesis Review: Ada

**Agent**: Ada — Rosetta Token Specialist
**Spec**: 086
**Date**: 2026-03-28
**Instructions**: Review the positions below and provide your assessment. The full synthesis is at `research/synthesis.md` if you need deeper context. Do not read other agents' review docs before completing yours.

---

## Position 1: Two-Part Readiness Model (R2 — Derive at Index Time)

**Proposal**: The Application MCP indexer derives per-platform readiness from the filesystem at index time:
- Technical readiness: scans for artifact presence (platform files, tests, schema, contracts)
- Human-reviewed: manual flag set when someone confirms the component works as expected
- Status derived: not-applicable → not-started → scaffold → development → production-ready

**What this means for you**: Token generation pipeline output (platform-specific token files) could be part of the technical readiness scan. If a component's platform directory exists but the token constants for that platform haven't been generated, that's a readiness signal.

**Questions**:
1. Does the readiness model need to account for token generation status per platform? (e.g., "iOS Swift token constants exist" vs. "iOS Swift token constants not yet generated")
2. Are there token pipeline artifacts that should factor into technical readiness beyond what's in the component directory?
3. Any concerns about the indexer scanning filesystem structure — does the token generation pipeline produce artifacts in predictable locations?

---

## Position 2: Knowledge Base Scope

**Proposal**: Platform agents get indexed knowledge bases. Three options:

- **Broad**: Index all of `src/components/core`
- **Targeted**: Index only platform-specific directories
- **Middle Ground**: Platform files plus shared `types.ts` and `tokens.ts`

A Platform Resource Map steering doc would point all agents to platform-specific token files and component implementations.

**Questions**:
1. Should the Platform Resource Map include token generation output locations per platform (e.g., `src/tokens/platforms/ios/`, `src/tokens/platforms/android/`)?
2. For platform agents consuming tokens, is `tokens.ts` (the shared token definitions) sufficient, or do they also need the platform-specific generated files?

---

## Ada's Assessment

### Position 1: Two-Part Readiness Model (R2)

**Agree with R2 — derive at index time. But the token generation question is more nuanced than the framing suggests.**

**Q1: Does readiness need to account for token generation status?**

Not as a separate signal — and here's why. The token generation pipeline produces platform-agnostic output files (`DesignTokens.web.css`, `DesignTokens.ios.swift`, `DesignTokens.android.kt`) that live in a shared output directory, not per-component. A component doesn't "have" generated token files — it *consumes* them. The generated files are a system-level artifact, not a component-level one.

What IS component-level is whether the component's `tokens.ts` references valid token names that exist in the generated output. We just fixed a bug where Container-Card-Base referenced `color.surface.primary` instead of the canonical `color.structure.surface.primary` — the token existed in the system, but the component was pointing at the wrong name. That's a compliance issue, not a readiness issue.

So: token generation status is a system-level health check ("has the pipeline been run recently?"), not a per-component readiness signal. The readiness scan should check for `tokens.ts` existence as a component artifact, but not whether the generated platform output is current.

HOWEVER — there's a counter-argument. Each component's native platform files contain hand-written `TokenMapping` files (e.g., `Container-Base/platforms/ios/TokenMapping.swift`) with explicit switch statements mapping token names to values. These are component-level artifacts that could be incomplete — as we saw when Container-Base's iOS TokenMapping didn't handle the surface variant token names. If the readiness scan could verify that a component's native TokenMapping covers all the tokens declared in its `tokens.ts`, that would be a meaningful technical readiness signal. But that's a deeper analysis than filesystem presence — it's a content validation. Probably out of scope for the indexer, more appropriate for a compliance test (Thurgood's domain).

**Q2: Token pipeline artifacts beyond the component directory?**

Two locations matter:

1. `src/tokens/semantic/` — where semantic tokens are defined. If a component references a semantic token that doesn't exist here, that's a problem. But this is a system-level concern, not per-component readiness.

2. `src/tokens/platforms/{ios,android}/` — platform-specific token files (currently just MotionTokens). These are hand-authored, not generated. They're relevant for platform agents but not for component readiness.

The generated output (`dist/` or `output/` or `final-verification/`) is ephemeral — it's produced by running the pipeline, not checked in as a source of truth. The readiness scan shouldn't depend on it.

**Q3: Does the token pipeline produce artifacts in predictable locations?**

Yes, with a caveat. The pipeline output location is configurable (`generateTokenFiles(outputDir)`), but the default is `output/`. The `final-verification/` directory is a manually-copied snapshot (and as we discovered, often stale). The actual source of truth is the pipeline itself, not any persisted output.

For the indexer, this means: don't scan for generated token output. Scan for the source artifacts (`tokens.ts`, `types.ts`, platform implementation files). The generated output is a build artifact, not a source artifact.

---

### Position 2: Knowledge Base Scope

**Agree with Middle Ground — platform files plus `types.ts` and `tokens.ts`. One addition needed.**

**Q1: Should the Platform Resource Map include token generation output locations?**

Yes, but with the right framing. The resource map should include:
- `src/tokens/` — primitive token definitions (the mathematical foundation)
- `src/tokens/semantic/` — semantic token definitions (what components reference)
- `src/tokens/platforms/{ios,android}/` — hand-authored platform-specific token files (MotionTokens)
- Pipeline entry point: `src/generators/generateTokenFiles.ts` — for when platform agents need to regenerate

It should NOT point to `final-verification/` or any snapshot directory — those are stale by definition.

**Q2: Is `tokens.ts` sufficient, or do platform agents also need generated files?**

`tokens.ts` is sufficient for understanding *what* tokens a component uses and *how* prop values map to token names. That's the contract.

Platform agents also need to understand *how* those token names resolve to platform-specific values — but that's in the component's own platform files (e.g., `TokenMapping.swift`, `TokenMapping.kt`), not in the generated output. The generated output is consumed at runtime, not at development time.

One addition to the Middle Ground scope: platform agents should also have access to `src/tokens/semantic/ColorTokens.ts` (and other semantic token definition files) when they need to verify that a token name is canonical. We just burned time on a naming mismatch that could have been caught if the platform implementation had been checked against the semantic token source. Including the semantic token definitions in the knowledge base — or at least in the Platform Resource Map — would help.

This doesn't mean indexing all of `src/tokens/` for every platform agent. It means the resource map should point to `src/tokens/semantic/` as the canonical reference for "what token names exist," and platform agents should know to check there when they're unsure about a token name.

---

### Cross-Cutting Concern: The Naming Mismatch Pattern

The surface token naming bug we just fixed is directly relevant to this spec. Card used `color.surface.primary` everywhere — `tokens.ts`, schema, native platform files — while the canonical name was `color.structure.surface.primary`. This persisted undetected because:

1. No automated check validates that component token references match canonical token names
2. The web fallback chain masked the failure
3. The native files aren't compiled, so the mismatch was never caught by a build

The readiness model and knowledge base scope decisions should account for this class of bug. Specifically:
- The technical readiness scan could flag components whose `tokens.ts` references token names not found in the semantic token registry — but that's a content validation, not a filesystem scan, so it may be out of scope for the indexer
- The Platform Resource Map should make the canonical token name source (`src/tokens/semantic/`) discoverable, so platform agents and Lina can verify names during authoring
- This reinforces the "feedback loop gap" root cause in the synthesis — Lina authored token references without a way to verify them against the canonical source
