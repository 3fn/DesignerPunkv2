# Task 2 Summary: Figma Import — WCAG Mode

**Spec**: 077 — DTCG & Figma wcagValue Support
**Date**: 2026-03-13

## Changes

- Replaced Figma wcagValue guard rail (throw) with mode-conditional resolution
- Semantics collection now has 3 modes: light, dark, wcag
- Tokens with `$extensions.designerpunk.modes.wcag` resolve to different Figma variable values per mode
- Tokens without WCAG override fall back to light value (Figma constraint)
- Primitives collection unchanged (no WCAG mode — primitives are theme-invariant)

## Impact

- Figma variable sync is no longer blocked by wcagValue tokens
- Designers can switch between Standard and WCAG themes in the Figma UI
- First real exercise of mode-conditional resolution (light/dark previously held identical values)
