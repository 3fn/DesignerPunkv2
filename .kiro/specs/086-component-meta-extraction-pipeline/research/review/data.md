# Synthesis Review: Data

**Agent**: Data — Android Platform Engineer
**Spec**: 086
**Date**: 2026-03-28
**Instructions**: Review the positions below and provide your assessment. The full synthesis is at `research/synthesis.md` if you need deeper context. Do not read other agents' review docs before completing yours.

---

## Position: Knowledge Base Scope

**Proposal**: You'd get an indexed knowledge base for Android-specific source files, making them searchable rather than requiring manual file navigation. Three options:

- **Broad**: Index all of `src/components/core` — every component's files across all platforms
- **Targeted**: Index only `src/components/core/*/platforms/android/` — just Android implementation files
- **Middle Ground**: Android platform files (`platforms/android/`) plus shared `types.ts` and `tokens.ts` per component

Additionally, a Platform Resource Map steering doc would be created so any agent can look up where platform-specific resources live. This would include Android token files at `src/tokens/platforms/android/`.

**Questions**:
1. Which option best matches your workflow? When you're implementing an Android component, do you primarily need the Kotlin files, or do you also reference the shared types and tokens?
2. Would you ever need to see web or iOS implementations for reference?
3. Is there anything else in the component directories you'd want indexed beyond platform files, types, and tokens?
4. Do you need the Android-specific token files (`src/tokens/platforms/android/MotionTokens.kt`, etc.) indexed alongside the component implementations?

---

## Your Assessment

Please provide your honest assessment — which option works best for you and why. Flag anything that would make your workflow harder or easier.
